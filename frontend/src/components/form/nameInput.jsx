import '../../index.css';
function NameInput(){
    return(
        <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-[var(--black-100)] text-sm font-semibold mb-2">Name</label>
            <input type="text" id="name" name="name" placeholder="John Doe" className="bg-white border border-(--gray-100) text-(--black-200) rounded-md p-2 placeholder:text-(--gray-50) focus:bg-[#F6F6F6]" />
        </div>
    );
}
export default NameInput;