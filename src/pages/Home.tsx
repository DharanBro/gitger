import React, { useEffect, useState } from 'react'
import { withCookies } from 'react-cookie';
import { useService } from '../components/ServiceProvider';
interface Props {
    cookies: any;
}


const Home: React.FC<Props> = ({ cookies }) => {

    const [user, setUser] = useState({
        name: "",
    })
    const service = useService();

    useEffect(() => {
        const getUserData = async () => {
            const data = await service.getUserData();
            setUser({ name: data.userName });
        }

        getUserData();
        // eslint-disable-next-line
    }, []);


    const renderHome = () => {
        return (
            <p>Welcom Home, {user.name}</p>
        )
    }

    return renderHome();


}

export default withCookies(Home)
