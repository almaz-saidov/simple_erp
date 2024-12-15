import '../styles/Components.css'

function IssuanceButton(props) {
    const { label, onClick } = props;

    const handleClick = () => {
        onClick && onClick();
    }

    return (
        <div className="SubmitButtonWrapper">
            <button className="SubmitButton" onClick={handleClick}>{label}</button>
        </div>
    );
}

export default IssuanceButton;
