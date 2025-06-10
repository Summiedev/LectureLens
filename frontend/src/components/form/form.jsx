import NameInput from "./nameInput";
import EmailInput from "./emailInput";
import PasswordInput from "./passwordInput";
import ConfirmPasswordInput from "./confirmPassword";
import ContinueBtn from "./continuebtn";

function PageForm() {
    return(
        <>
        <NameInput />
        <EmailInput />
        <PasswordInput />
        <ConfirmPasswordInput />
        <ContinueBtn continueText="Continue →" />
        </>
    );
}
export default PageForm;