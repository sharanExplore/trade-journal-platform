function DeleteTrade({ tradeId, onDeleted }) {
    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this trade?"
        );

        if (!confirmed) {
            return;
        }

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                `http://localhost:5000/api/trades/${tradeId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete trade"
                );
            }

            console.log("Trade deleted:", data);

            onDeleted();
        } catch (error) {
            console.error("Delete trade error:", error);
        }
    };

    return (
        <button
            className="trade-action-button delete"
            title="Delete trade"
            onClick={handleDelete}
        >
            🗑
        </button>
    );
}

export default DeleteTrade;