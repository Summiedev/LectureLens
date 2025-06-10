import '../../index.css';

function ButtonBg({buttonText}) {
    return (
        <button className="bg-[var(--blue-100)] px-6 py-2 rounded-sm text-white">
            {buttonText}
        </button>
    );
}
export default ButtonBg;