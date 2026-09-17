import { useState } from 'react'

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
            const response = await fetch(
                'http://localhost:5000/api/auth/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                }
            )

            const data = await response.json()

            if (response.ok) {
                localStorage.setItem('token', data.token)
                console.log('Login successful')
            } else {
                console.error('Login failed:', data.message)
            }
        } catch (error) {
            console.error('Network error:', error)
        }
    }

    return (
        <main>
            <h1>Login to Tradefolio</h1>

            <form onSubmit={handleSubmit}>
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