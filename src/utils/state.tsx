import {
    SmartContract,
    DefaultSmartContractController, 
} from '@elrondnetwork/erdjs';

export interface IContractInteractor {
    contract: SmartContract;
    controller: DefaultSmartContractController;
}

export interface IStakeSetting {
    stake_token: string;
    reward_token: string;
    min_stake_limit: number;
    lock_period: number;
    undelegation_period: number;
    claim_lock_period: number;
    apy: number;
    total_staked_amount: number;
    number_of_stakers: number;
}

export interface IStakeAccount {
    address: string,
    staked_amount: number,
    lock_end_timestamp: number,
    unstaked_amount: number,
    undelegation_end_timestamp: number,
    collectable_amount: number,
    reward_amount: number,
    last_claim_timestamp: number,
}