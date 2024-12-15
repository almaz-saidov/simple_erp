
import Input from '../../components/Input';
import '../../styles/Card.css';


function HistoryNavButton(props) {
    const { label, type, getCurrentType, setHistoryType } = props;

    return (
        <button
            className={(getCurrentType() == type) ? "CurrentHistoryNavButton" : "HistoryNavButton"}
            onClick={() => setHistoryType(type)}>
            {label}
        </button>

    );
}

export default HistoryNavButton;
