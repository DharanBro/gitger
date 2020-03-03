import axios from 'axios';
import { Octokit } from '@octokit/rest';

type IUserData = {
    userName: string;
};
class Github {
    private octokit: Octokit = new Octokit();
    authenticate(code: string, cookies: any, callback: (token: string) => void) {
        axios.get(`https://gitger-gatekeeper.herokuapp.com/authenticate/${code}`)
            .then((response) => {
                callback(response.data.token);
            })
            .catch((error) => {
                callback(error);
            });
    }

    initiate(token: string) {
        this.octokit = new Octokit({
            auth: token
        });
    }

    getUserData() {
        return new Promise<IUserData>(async (resolve, reject) => {
            try {
                const response = await this.octokit.users.getAuthenticated();
                resolve({
                    userName: response.data.login,
                })
            } catch (error) {
                console.log(error);
                reject(error);
            }

        });
    }

}

export default Github;