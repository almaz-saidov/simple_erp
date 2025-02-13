import '../styles/Card.css'
import BackButton from './BackButton'

function CardHeader(props) {
    const { label, marketName, isMarketNameVisible = true } = props;
    return (
        <div className="CardHeader">
            <h1>{label}</h1>
            <div className="CardMarketName">
                {isMarketNameVisible && <h1>{marketName ? marketName : "unknown"}</h1>}
            </div>
        </div>
    );
}


export default CardHeader;

