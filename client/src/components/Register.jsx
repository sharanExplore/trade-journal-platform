import { useState } from 'react'

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    })
    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
            const response = await fetch(
                'http://localhost:5000/api/auth/register',
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
                console.log('User registered successfully')
                console.log(data)
            } else {
                console.error('Registration failed:', data.message)
            }
        } catch (error) {
            console.error('Network error:', error)
        }
    }


    return (
        <main>
            <h1>Create your Tradefolio account</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name</label>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={(event) =>
                            setFormData({
                                ...formData,
                                name: event.target.value,
                            })
                        }
                    />
                </div>

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
                    Create Account
                </button>
            </form>
        </main>
    )
}

export default Register