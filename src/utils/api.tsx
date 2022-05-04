import axios from "axios";
import {
    convertWeiToEsdt,
    convertWeiToEgld,
} from './convert';
import CoinLogo from 'assets/img/coin.png';

export async function getBalanceOfToken(apiAddress, account, token_id) {
    try {
        if (token_id == 'EGLD') {
            return convertWeiToEgld(account.balance);
        }

        const res = await axios.get(`${apiAddress}/accounts/${account.address}/tokens?identifier=${token_id}`);
        // console.log('res', res);
        if (res.data?.length > 0) {
            const token = res.data[0];
            return convertWeiToEsdt(token.balance, token.decimals);
        }
    } catch(e) {
        console.log('getBalanceOfToken error', e);
    }

    return 0;
}

export async function getEsdtsOfAddress(apiAddress, account) {
    try {
        const res = await axios.get(`${apiAddress}/accounts/${account.address}/tokens?size=1000`);
        // console.log('res', res);
        if (res.data?.length > 0) {
            console.log('res.data', res.data);
            return res.data.map(v => {
                return {
                    identifier: v.identifier,
                    ticker: v.ticker,
                    decimals: v.decimals,
                    balance: convertWeiToEsdt(v.balance, v.decimals),
                    logo: v.assets ? v.assets.pngUrl : CoinLogo,
                };
            });
        }
    } catch(e) {
        console.log('getEsdtsOfAddress error', e);
    }

    return 0;
}