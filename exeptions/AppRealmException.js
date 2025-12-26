class AppRealmException extends Error{
    constructor(msg){
        this.message=msg;
        super(msg);
        this.name="AppRealmException";
    }
}