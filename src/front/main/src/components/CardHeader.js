import '../styles/Card.css'
import BackButton from './BackButton'

function CardHeader(props) {
    const { label, marketName } = props;
    return (
        <div className="CardHeader">
            <h1>{label}</h1>
            <div className="CardMarketName">
                <h1>{marketName ? marketName : "unknown"}</h1>
            </div>
        </div>
    );
}

export default CardHeader;