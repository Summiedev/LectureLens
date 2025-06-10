import "../../index.css";

function ContinueBtn(continueText) {
    return (
        <button className="bg-[var(--blue-300)] w-full text-white font-semibold py-2 px-4 rounded">
            {continueText}
        </button>
    );
}
export default ContinueBtn;