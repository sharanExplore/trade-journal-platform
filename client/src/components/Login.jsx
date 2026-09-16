import { useState } from 'react'

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    return (
        <main>
            <h1>Login to Tradefolio</h1>

            <form>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(event) =>
                            setFormData({
                                ...formData,
                                email: event.target.value,
                            })
                        }
                    />
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(event) =>
                            setFormData({
                                ...formData,
                                password: event.target.value,
                            })
                        }
                    />
                </div>

                <button type="submit">
                    Login
                </button>
            </form>
        </main>
    )
}

export default Login