function LoadingSpinner() {
    return (
        <div className="d-flex justify-content-center my-24">
            <div className="spinner-border text-danger" role="status" style={{ width: "4rem", height: "4rem" }}>
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
}
export default LoadingSpinner;