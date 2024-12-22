import CardHeader from "../../components/CardHeader";
import Input from '../../components/Input'
import Detail from "../../components/Detail";
import { SyncLoader } from 'react-spinners'
import { useEffect, useState } from 'react';
import { fetchDetails } from "../../api/Api";

import '../../styles/Card.css'
import '../../styles/Cards/Search.css'
import '../../styles/Components.css'

function Search() {
    const [detailNumber, setDetailNumber] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [detail, setDetail] = useState(null);


    const loadDetails = () => {
        if (data.length == 0) {
            return (
                <div className="NumberDoesNotExist">
                    <span>Ничего <br /> не найдено</span>
                </div>
            )
        }

        return (<div className="DetailsWrapper">
            {
                data.map((el, index) => (
                    <Detail detail={el} key={index} />
                ))
            }
            <div className='Space' />
        </div>
        )
    }

    useEffect(() => {
        fetchDetails(detailNumber, setData, setLoading)

    }, [detailNumber]);

    return (
        <div className="Search">
            <CardHeader label="Поиск" />
            <Input label="" hint="Номер детали" isDynamic={true} isLong={false} setParentText={setDetailNumber} isSearch={true} />
            {loading ?
                <div className='LoaderWrapper'>
                    <SyncLoader color="#A7A7A7" />
                </div>
                :

                < div className="SearchContent">
                    {loadDetails()}
                </div>}
        </div >

    );
}

export default Search;