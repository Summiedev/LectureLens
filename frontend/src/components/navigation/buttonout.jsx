import '../../index.css';

function ButtonOut({buttonText}) {
    return (
        <button className="border-2 border-(--blue-100) px-6 py-2 rounded-sm text-(--blue-100) bg-[var(--blue-200)] ">
            {buttonText}
        </button>
    );
}
export default ButtonOut;