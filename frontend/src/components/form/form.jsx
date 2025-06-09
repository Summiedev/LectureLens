import NameInput from "./nameInput";
import EmailInput from "./emailInput";
import PasswordInput from "./passwordInput";
import ConfirmPasswordInput from "./confirmPassword";

function PageForm() {
    return(
        <>
        <NameInput />
        <EmailInput />
        <PasswordInput />
        <ConfirmPasswordInput />
        </>
    );
}
export default PageForm;