function AddTradeModal({ onClose }) {
    return (
        <div className="add-trade-overlay">
            <div className="add-trade-modal">
                <div className="add-trade-header">
                    <div>
                        <h2>Add Trade</h2>
                        <p>Log your trade details to track performance.</p>
                    </div>

                    <button
                        className="add-trade-close"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <div className="add-trade-body">
                    <p>Modal working</p>
                </div>
            </div>
        </div>
    );
}

export default AddTradeModal;
