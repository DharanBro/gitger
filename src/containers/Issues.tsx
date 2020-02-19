import React, { useEffect } from 'react';
import { useLocation } from "react-router-dom";
import axios from 'axios';


interface Props {

}
// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Issues: React.FC<Props> = (props) => {
    let query = useQuery();
    const code = query.get("code");
    useEffect(() => {
        const getAccesToken = async () => {
            const response = await axios.post("https://github.com/login/oauth/access_token", {
                client_id: 'a6f5adc4aade86988989',
                client_secret: '22483ce3ce75a7f591e50c592a6a8bc2caacbfe5',
                code,
            }, {
                headers: { "Access-Control-Allow-Origin": "*" }
            });

            console.log(response);
        }

        getAccesToken();


    }, [code])
    console.log("render Issues", query.get("code"))
    return (
        <div>
            Issues
        </div>
    )
}

export default Issues
