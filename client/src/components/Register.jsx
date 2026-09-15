function Register() {
    return (
        <main>
            <h1>Create your Tradefolio account</h1>

            <form>
                <div>
                    <label htmlFor="name">Name</label>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                    />
                </div>

                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                    />
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                    />
                </div>

                <button type="submit">
                    Create Account
                </button>
            </form>
        </main>
    );
}

export default Register;