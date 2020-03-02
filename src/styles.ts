
import { createStyles, makeStyles, Theme } from '@material-ui/core';
export default makeStyles((theme: Theme) =>
    createStyles({
        button: {
            margin: theme.spacing(1),
            width: 250,
        },
        div: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "calc(100vh -  64px)",
        }
    }),
);