import { useEffect } from 'react'

function Dashboard() {
    useEffect(() => {
        const token = localStorage.getItem('token')

        fetch('http://localhost:5000/api/trades', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
            })
            .catch((error) => {
                console.error('Error fetching trades:', error)
            })
    }, [])

    return (
        <main>
            <h1>Tradefolio Dashboard</h1>
            <p>You are logged in successfully.</p>
        </main>
    )
}

export default Dashboard