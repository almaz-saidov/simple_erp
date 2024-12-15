import '../styles/Card.css'

function CardHeader(props) {
    const { label } = props;
    return (
        <div className="CardHeader">
            <h1>{label}</h1>
        </div>
    );
}

export default CardHeader;