class winCalControler {

    constructor() {

        /* Conf da criação de atributos a serem utilizados na classe.
        ele é executado automaticameticamente */
        
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this._displayCalc = document.querySelector('#display');
        this.initButtons();
        this.initKeyboard();
        this.initialize();
    }

    initialize() {
        this.setLastNumberToDisplay();
        //Método de inicialização.
       
    }

    initButtons(){ 
        //Método para selecionar os botões 
        let buttons = document.querySelectorAll(".row > button");

        buttons.forEach(btn =>{
            btn.addEventListener('click', e =>{
                let btnTexto = btn.id;

                this.execBtn(btnTexto);
            })
        })
    }

    initKeyboard(){
        document.addEventListener('keyup',e=>{
           
            switch (e.key){

                case 'Escape':
                    this.clearAll();
                break;
    
                case 'Backspace':
                    this.clearEntry();
                break;
    
                case '+':         
                case '-':
                case '/':
                case '*':
                case '%':
                    this.addOperation(e.key);
                break;
    
                case 'fracao':
                    this.setError();
                break;
    
                case 'potencia':
                    this.setError();
                break;
    
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.displayCalc = e.key;
                    this.addOperation(parseInt(e.key));
                break;
    
                case ',':
                case '.':
                    this.addDot(',');
                break;
    
                case '=':
                case 'Enter':
                    this.calc();
                break;
    
              
    
            }
        });
    }

    clearAll(){
        this._operation = [];
        this._lastNumber = '';
        this._lastOperatior = '';
        this.setLastNumberToDisplay();
    }

    clearEntry(){
        /* Esse método retira o ultimo valor do array (this._operation) através do pop()*/
        this._operation.pop();
        this.setLastNumberToDisplay();
    }

    addDot(){
        let lastOperation = this.getLastOperation();

        if(lastOperation && lastOperation.split('').indexOf('.') > -1) return;

        if(this.isOperator(lastOperation) || !lastOperation) {
            this.pushOperation('0.');
        }else {
            this.setLastOperation(lastOperation.toString()+'.');
        }
        this.setLastNumberToDisplay();
    }

    execBtn(value) {
        /*Método criado para pegar o valor dos buttons (btnText) passando através de um
        parâmetro(value)*/

        switch (value){

            case 'c':
                this.clearAll();
            break;

            case 'ce':
                this.clearEntry();
            break;

            case '+':
                this.addOperation('+');
            break;

            case '-':
                this.addOperation('-');
            break;

            case '/':
                this.addOperation('-');
            break;

            case '*':
                this.addOperation('*');
            break;

            case '%':
                this.addOperation('%');
            break;

            case 'fracao':
            case 'potencia':
            case 'raiz':   
               this.espacialCal(value);
            break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.displayCalc = value;
                this.addOperation(parseInt(value));
            break;

            case ',':
                this.addDot(',');
            break;

            case '=':
                this.calc();
            break;

            default:
                this.setError();
            break;

        }
    }

    espacialCal(valor){

        let result;

        switch (valor){
            case 'fracao':
                result = this.getResult();
                result = 1/this._operation[0];
                this._operation = [result];
                this.displayCalc = result;
            break;

            case 'potencia':
                result = this.getResult();
                result = Math.pow(this._operation[0],2);
                this._operation = [result];
                this.displayCalc = result;
            break;

            case 'raiz':
                result = this.getResult();
                result = Math.sqrt(this._operation[0]);
                this._operation = [result];
                this.displayCalc = result;
            break;
        }
    }

    setError(){
        this.displayCalc='Error'
    }

    getLastOperation(){
        //Método para pegar o ultimo item do array
        return this._operation[this._operation.length-1];
    }

    isOperator(value){
        //Verificando se o value é um operador. 
       return (['+','-','*','%','/'].indexOf(value)>-1) ;
    }

    setLastOperation(value){
        this._operation[this._operation.length -1 ] = value;
    }

    getResult(){
        return eval(this._operation.join(""));
    }



    calc(){

            let last = '';
            this._lastOperator = this.getLastItem();

            /*join -> Retorna o valor do Array (this._operation) como String 
            eval -> Realiza a operação*/

            if (this._operation.length < 3){
                let firstItem = this._operation[0];
                this._operation = [firstItem, this._lastOperator, this._lastNumber];
            }

            if (this._operation.length > 3){

                last = this._operation.pop();
                this._lastNumber = this.getResult();

            } else if (this._operation.length == 3){
                this._lastNumber = this.getLastItem(false);
            }
            

            let result = this.getResult();
            
            if(last == '%'){

                /* Caso seja porcentagem, o result receberá ele mesmo dividido por 100 (=/) */

                result /= 100;

                this._operation = [result];

            } else {
           
                //Retorna o valor da operação 
                this._operation = [result];

                if(last) this._operation.push(last);
            }

            

            this.setLastNumberToDisplay();
        }

    pushOperation(value){
        this._operation.push(value);

        if(this._operation.length > 3 ) {

            this.calc();

            console.log('A',this._operation);

        }
    }

    getLastItem(isOperator = true){
        let lastItem;

        for(let i = this._operation.length-1; i >=0; i--){

            if(this.isOperator(this._operation[i]) == isOperator){
                lastItem = this._operation[i];
                break;
            }
            
        }

        if(!lastItem){
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }
        
        return lastItem;
    }

   
    setLastNumberToDisplay(){
        
        let Lastnumber = this.getLastItem(false);

        if(!Lastnumber) Lastnumber = 0;

        this.displayCalc = Lastnumber;
    }

    addOperation(value) {

       

        /* Verificando se o ultimo numero é uma string ou um inteiro*/
        if(isNaN(this.getLastOperation())){

            /* Caso seja String, verificará se é um operador ou não */
            if(this.isOperator(value)){

                //Troca de operador
                this.setLastOperation(value);

            } else {
                this._operation.push(value)
            }   

        } else {

            if(this.isOperator(value)) {

                this.pushOperation(value);

            } else {

                /* Caso seja inteiro(INT), o ultimo numero será 
                convertido para String e concatenado com o valor. */
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);  

                this.setLastNumberToDisplay();

            }
            
          
            
        }

        /*Esse método pega o valor vindo o button
        e adiciona ele ao array(this._operation) através do push */

        //this._operation.push(value)
        console.log(this._operation)
    }
       

    /*TODA VEZ QUE TIVER UM ATRIBUTO PRIVADO, É NECESSÁRIO TER UM GET E SET PARA
    RETORNAR E/OU ATRIBUIR UM VALOR A ESSE ATRIBUTO*/

    //GET retorna um atributo privado; Tornando ele acessivel. 
    get displayCalc() {
        return this._displayCalc.innerHTML;
    }

    //SET atribui um valor a um atributo privado. 
    set displayCalc(valor) {
       if(valor.length > 10){
            this.setError();
            return false;
       } else {
            this._displayCalc.innerHTML = valor ;
       }

       if(this.espacialCal(valor) > 10){
            this.setError();
            return false;
       } else {
            this._displayCalc.innerHTML = valor ;
       }
          
             //this._displayCalc.innerHTML = valor + '.';
        
       
    }

}