import { useState } from 'react';

import { useUserContext } from '../../context/UserContext';

export default function Login() {
    const {login} = useUserContext();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState(false);

    const onChange = (e, save) => {
        save(e.target.value);
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        let logged;
        try {
            logged = await login(username, password);
        }
        catch(e) {
            setError(!logged);
            setUsername('');
            setPassword('');
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-login-img bg-cover">
            <main className="w-1/2 max-w-sm bg-gray-900 rounded-md p-8 md:p-10 shadow-md">
                <form onSubmit={onSubmitHandler} className="flex flex-col gap-4 items-center justify-center">
                    <h2 className="uppercase text-primary font-medium font-roboto font-black text-4xl mb-4">Posts App</h2>

                    {error && <p className="w-full rounded p-3 text-center text-white font-roboto bg-red-700 select-none">
                        An error occurred. Please try again.
                    </p>}

                    <input className="font-medium bg-gray-700 w-full text-yellow-500 focus:outline-none focus:ring p-2 rounded"
                        type='text'
                        value={username}
                        placeholder='Username'
                        onChange={(e) => onChange(e, setUsername)}
                    />

                    <input className="font-medium bg-gray-700 w-full text-yellow-500 focus:outline-none focus:ring p-2 rounded"
                        type="password"
                        placeholder="Password"
                        onChange={(e) => onChange(e, setPassword)}
                        value={password}
                    />

                    <button className="mt-6 w-md transition rounded duration-300 ease-in-out text-xl text-extrabold uppercase bg-primary hover:bg-primary-dark py-2 px-4 text-gray-100">Sign In </button>
                </form>
            </main>
        </div>
    );
}