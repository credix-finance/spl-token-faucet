import {Link, makeStyles} from '@material-ui/core';
import LaunchIcon from '@material-ui/icons/Launch';
import {useSnackbar, VariantType} from 'notistack';
import React, {useCallback} from 'react';

const useStyles = makeStyles({
    notification: {
        display: 'flex',
        alignItems: 'center',
    },
    link: {
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        marginLeft: 16,
        textDecoration: 'underline',
        '&:hover': {
            color: '#000000',
        },
    },
    icon: {
        fontSize: 20,
        marginLeft: 8,
    },
});

export function useNotify() {
    const styles = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const clusterMap = {
      "https://api.devnet.solana.com": "devnet",
      "https://api.testnet.solana.com": "testnet"
    }

    return useCallback(
        (variant: VariantType, message: string, signature?: string, cluster?: string) => {
            enqueueSnackbar(
                <span className={styles.notification}>
                    {message}
                    {signature && (
                        <Link
                            className={styles.link}
                            href={`https://explorer.solana.com/tx/${signature}?cluster=${clusterMap[cluster]}`}
                            target="_blank"
                        >
                            Transaction
                            <LaunchIcon className={styles.icon} />
                        </Link>
                    )}
                </span>,
                { variant }
            );
        },
        [enqueueSnackbar, styles]
    );
}
