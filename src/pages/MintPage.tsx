import AnimatedBettingForm from "../components/GameConfiguration"

export default function MintPage(props: { openSnackbar: CallableFunction }) {
    return <div><AnimatedBettingForm openSnackbar={props.openSnackbar} ></AnimatedBettingForm></div>
}