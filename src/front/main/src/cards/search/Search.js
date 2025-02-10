import CardHeader from "../../components/CardHeader";
import Input from '../../components/Input'
import Detail from "../../components/Detail";
import { SyncLoader } from 'react-spinners'
import { useEffect, useState, useContext } from 'react';
import { fetchDetailsNew, deleteDetailById } from "../../api/Api";
import { MarketContext } from '../../markets/MarketContext';
import SlidePanel from "../../components/slide_panel/SlidePanel";
import { DeleteButton } from '../../components/SubmitButton';
import toast from 'react-hot-toast';

import '../../styles/Card.css';
import '../../styles/Cards/Search.css';
import '../../styles/Components.css';

function Search() {
    const [detailNumber, setDetailNumber] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [detail, setDetail] = useState(null);
    const { value, setValue } = useContext(MarketContext);
    const [selectedItem, setSelectedItem] = useState(null); // Храним выбранный элемент
    const [isPanelOpen, setIsPanelOpen] = useState(false); // Открыта ли панель

    const handleItemClick = (item) => {
        setSelectedItem(item); // Устанавливаем выбранный элемент
        setIsPanelOpen(true); // Открываем панель
    };

    // Закрытие панели
    const closePanel = () => {
        setIsPanelOpen(false);
    };

    const loadDetails = () => {
        if (data.length == 0) {
            return (
                <div className="NumberDoesNotExist" >
                    <span>Ничего <br /> не найдено</span>
                </div>
            )
        }

        return (<div className="DetailsWrapper">
            {
                data.map((el, index) => (
                    <Detail detail={el} key={index} onClick={() => handleItemClick(el)} />
                ))
            }
            <div className='Space' />
        </div>
        )
    }

    const lookForDetails = async () => {
        setLoading(true);
        await fetchDetailsNew(detailNumber, setData, value.id);
        setLoading(false);
    }

    useEffect(() => {
        lookForDetails();
    }, [detailNumber]);


    const getDeleteFunc = (detailNumber) => {
        return async () => {
            try {
                setLoading(true);
                await deleteDetailById(detailNumber);
                lookForDetails();
                toast.success("Деталь удладена");
            } catch (e) {
                console.error('Ошибка в handleApiResponse:', e);
                toast.error('Что-то пошло не так');
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <div className="Search">
            <CardHeader label="Поиск" marketName={value.name} />
            <Input label=""
                hint="Номер запчасти"
                isDynamic={true}
                isLong={false}
                setParentText={setDetailNumber}
                isSearch={true}
                iconOnClick={lookForDetails}
            />
            {loading ?
                <div className='LoaderWrapper'>
                    <SyncLoader color="#A7A7A7" />
                </div>
                :

                < div className="SearchContent">
                    {loadDetails()}
                </div>}
            {selectedItem &&
                <SlidePanel
                    isOpen={isPanelOpen}
                    onClose={closePanel}
                    children={
                        <div>
                            <Detail detail={selectedItem} />
                            <DeleteButton onClick={getDeleteFunc(selectedItem.detailNumber)} />
                        </div>
                    }
                />}
        </div >


    );
}

export default Search;