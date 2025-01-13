import '../styles/Card.css'
import BackButton from './BackButton'

function CardHeader(props) {
    const { label } = props;
    return (
        <div className="CardHeader">
            <h1>{label}</h1>
            <BackButton />
        </div>
    );
}

export default CardHeader;