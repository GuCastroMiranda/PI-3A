import ButtonCadstLogin from "@/components/ui/ButtonCadstLogin";

export default function login(){
    return(
        <ButtonCadstLogin 
        title="Login"
        onPress={() => console.log('login')}
    />
    )
}