import { makeAutoObservable} from 'mobx';

export default class ActivityStore {
    title = 'Hello from Mobx!';

    constructor() {
            // makeObservable( {
            // title: observable,
            // setTitle: action.bound
            makeAutoObservable(this)

        }
    

    setTitle = () => {
        this.title = this.title + '!!'
    }
}