import '../../index.css';
function ButtonNo({buttonText}) {
    return (
        <button className="text-[var(--blue-100)] px-6 py-2 rounded-sm ">
            {buttonText}
        </button>
    );
}
export default ButtonNo;