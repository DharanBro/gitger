import React, { useEffect } from 'react'

interface Props {

}

const Home: React.FC<Props> = () => {
    console.log("render home")
    useEffect(() => {
        window.location.href = 'https://github.com/login/oauth/authorize?client_id=a6f5adc4aade86988989&redirect_uri=http://localhost:3000/issues';
    }, [])

    return null;

}

export default Home
