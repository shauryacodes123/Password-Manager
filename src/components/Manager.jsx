import React from 'react'
import Lottie from 'lottie-react'
import { useEffect, useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';

const Manager = () => {
    const [animationData, setAnimationData] = useState(null);
    const ref = useRef()
    const passwordref = useRef()
    const [form, setform] = useState({ site: "", username: "", password: "" })
    const [passwordarray, setpasswordarray] = useState([])

    const showPassword = () => {
        if (ref.current.src.includes("/openeye.svg")) {
            ref.current.src = "/closeeye.svg"
            passwordref.current.type = "text"
        }
        else {
            ref.current.src = "/openeye.svg"
            passwordref.current.type = "password"
        }
    }

    const getpassword = async () => {
        try {
            let res = await fetch("http://localhost:3000/")
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            let passwords = await res.json()
            setpasswordarray(passwords)
        } catch (err) {
            console.error("Failed to load passwords:", err)
            toast.error("Could not load passwords — is the backend running?")
        }
    }

    useEffect(() => {
        getpassword()
    }, [])

    const copybtn = (text) => {
        navigator.clipboard.writeText(text)
        toast('Copied to clipboard!', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
        });
    }

    const handlechange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }

    const savepassword = async () => {
        if (form.site.length >= 3 && form.username.length >= 3 && form.password.length >= 3) {
            const id = form.id ? form.id : uuidv4();
            const newItem = { ...form, id };

            try {
                const res = await fetch("http://localhost:3000/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newItem)
                });
                if (!res.ok) {
                    const errBody = await res.text();
                    throw new Error(`HTTP ${res.status}: ${errBody}`);
                }

                setpasswordarray([...passwordarray, newItem]);
                setform({ site: "", username: "", password: "" });
                toast.success("Password saved!");
            } catch (err) {
                console.error("Save failed:", err)
                toast.error("Could not save — is the backend running?");
            }
        }
    }

    const handledelete = async (id) => {
        let c = confirm("Delete this password?")
        if (c) {
            try {
                const res = await fetch("http://localhost:3000/", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id })
                });
                if (!res.ok) {
                    const errBody = await res.text();
                    throw new Error(`HTTP ${res.status}: ${errBody}`);
                }

                const newpasswordarray = passwordarray.filter(item => item.id !== id)
                setpasswordarray(newpasswordarray)
                toast.success("Password deleted");
            } catch (err) {
                console.error("Delete failed:", err);
                toast.error("Could not delete — is the backend running?");
            }
        }
    }

    const handleedit = (id) => {
        const item = passwordarray.find(item => item.id === id)
        setform({ ...item, id: id })
        setpasswordarray(passwordarray.filter(item => item.id != id))
    }

    useEffect(() => {
        fetch("/add.json")
            .then((res) => res.json())
            .then((data) => setAnimationData(data));
    }, []);

    return (
        <div>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            <div className="font-bold flex flex-col py-12 items-center justify-center mx-auto w-full max-w-5xl px-4 gap-4">
                {/* Header */}
                <div>
                    <span className="text-green-400 text-2xl">&lt;</span>
                    <span className="text-2xl">Pass</span>
                    <span className="text-green-400 text-2xl">OP/&gt;</span>
                </div>
                <div className="text-sm text-gray-600">
                    <span>Your Own Password Manager</span>
                </div>

                {/* Inputs */}
                <input value={form.site} onChange={handlechange} name='site' type="text" className="w-full border border-green-400 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder='Enter the URL' />
                <div className="flex flex-col md:flex-row gap-3 w-full">
                    <input value={form.username} onChange={handlechange} name='username' type="text" className="flex-1 min-w-0 border border-green-400 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder='Username' />
                    <div className="relative flex-1 min-w-0 flex items-center">
                        <input ref={passwordref} value={form.password} onChange={handlechange} name='password' type="password" className="w-full border border-green-400 rounded-full px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder='Password' />
                        <span className="absolute right-3 hover:cursor-pointer" onClick={showPassword}>
                            <img ref={ref} src="/openeye.svg" alt="toggle visibility" />
                        </span>
                    </div>
                </div>

                {/* Save button */}
                <button onClick={savepassword} className="flex items-center justify-center gap-2 border border-green-500 rounded-full bg-green-300 h-10 px-8 hover:cursor-pointer hover:bg-green-500 transition-colors">
                    <div>
                        {animationData && (
                            <Lottie animationData={animationData} loop autoplay style={{ height: 40, width: 40 }} />
                        )}
                    </div>
                    <div className="text-[15px] font-medium">
                        Save
                    </div>
                </button>

                {/* Password list */}
                <div className="passwords w-full mt-4">
                    <h1 className="text-2xl font-bold py-4">Your Passwords</h1>

                    {passwordarray.length === 0 && (
                        <div className="px-2 text-gray-500">No passwords saved yet</div>
                    )}

                    {passwordarray.length !== 0 && (
                        <div className="w-full overflow-x-auto rounded-xl shadow-sm">
                            <table className="w-full min-w-[600px] border-collapse">
                                <thead className="text-white bg-green-800">
                                    <tr>
                                        <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Site</th>
                                        <th className="text-left py-3 px-4 font-semibold">Username</th>
                                        <th className="text-left py-3 px-4 font-semibold">Password</th>
                                        <th className="text-left py-3 px-4 font-semibold rounded-tr-xl">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {passwordarray.map((item, idx) => (
                                        <tr
                                            key={item.id}
                                            className={`${idx % 2 === 0 ? 'bg-green-100' : 'bg-green-50'} border-b border-green-200 hover:bg-green-200 transition-colors`}
                                        >
                                            <td className="py-3 px-4 max-w-0">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <a
                                                        href={item.site}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="truncate text-blue-700 hover:underline block min-w-0 max-w-[200px]"
                                                        title={item.site}
                                                    >
                                                        {item.site}
                                                    </a>
                                                    <button onClick={() => copybtn(item.site)} className="shrink-0 hover:scale-110 transition-transform" aria-label="Copy site">
                                                        <img src="/copy.svg" alt="" className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 max-w-0">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span className="truncate block min-w-0 max-w-[150px]" title={item.username}>
                                                        {item.username}
                                                    </span>
                                                    <button onClick={() => copybtn(item.username)} className="shrink-0 hover:scale-110 transition-transform" aria-label="Copy username">
                                                        <img src="/copy.svg" alt="" className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="tracking-wider">
                                                        {"*".repeat(item.password.length)}
                                                    </span>
                                                    <button onClick={() => copybtn(item.password)} className="shrink-0 hover:scale-110 transition-transform" aria-label="Copy password">
                                                        <img src="/copy.svg" alt="" className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <button onClick={() => handleedit(item.id)} className="hover:scale-110 transition-transform" aria-label="Edit">
                                                        <lord-icon
                                                            src="https://cdn.lordicon.com/exymduqj.json"
                                                            trigger="hover"
                                                            style={{ width: "25px", height: "25px" }}>
                                                        </lord-icon>
                                                    </button>
                                                    <button onClick={() => handledelete(item.id)} className="hover:scale-110 transition-transform" aria-label="Delete">
                                                        <lord-icon
                                                            src="https://cdn.lordicon.com/jzinekkv.json"
                                                            trigger="hover"
                                                            style={{ width: "25px", height: "25px" }}>
                                                        </lord-icon>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Manager
