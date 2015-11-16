if (!String.contains) {
    String.prototype.contains = function (e) {
        return this.indexOf(e) >= 0;
    }
}



$(document).ready(function () {
    $('#messages').puigrowl();
});



function nuevoArbol() {

    var expresion = $('#txtExtrada').val();

    var nodos = Arbol.crear(expresion);

    console.info(nodos);

    $('#resultado').html('=' + nodos[0].data);

    $('#tree').html('');
    $('#tree').append('<div class="pui-tree-container"></div>');


    $('#tree div').puitree({
        selectionMode: 'single',
        nodeSelect: function (event, ui) {
            console.info(ui)
            $('#messages').puigrowl('show', [{
                severity: 'info',
                summary: '',
                detail: ui.data
            }]);
        },
        nodes: nodos
    });

}


var Parcer = {

    operadores: {
        '^': 5,
        '*': 4,
        '/': 4,
        '+': 3,
        '-': 3,
        ')': 2,
        '(': 1,
        obtenerPrecedencia: function () {

        }
    },

    /**
     *Depura la exprecion algebraica, quita espacios en blanco y deja un espacion entre peradores y dijitos
     */
    prepararExprecion: function (exprecion) {
        var simbolos = "+-*/()^";
        var salida = "";
        exprecion = exprecion.replace(/\\s+/, '');
        exprecion = "(" + exprecion + ")";
        for (var i = 0; i < exprecion.length; i++) {
            if (simbolos.contains(exprecion.charAt(i))) {
                salida += " " + exprecion.charAt(i) + " ";
            } else {
                salida += exprecion.charAt(i);
            }

        }
        return salida.trim();
    },
    /**
     *Determina la jerarquia de operadores
     */
    jerarquia: function (operador) {
        if (this.operadores[operador]) {
            return this.operadores[operador];
        }
        //si no es un operador tiene mayor precedencia
        return 99;
    },
    aPosFija: function (expresion) {
        expresion = this.prepararExprecion(expresion);
        var infija = expresion.split(" ");

        var E = infija.reverse(), // Entrada
            P = [], // Temporal
            S = []; //salida

        while (E.length > 0) {

            // E[E.length - 1] extrae el ultimo valor de la pilla  .peek();
            // console.info("E", E, "S", S, "P", P)
            switch (this.jerarquia(E[E.length - 1])) {
            case 1:
                P.push(E.pop());
                break;
            case 2:
                while (P[P.length - 1] != "(") {
                    S.push(P.pop())
                }
                P.pop();
                E.pop();
                break;
            case 3:
            case 4:
            case 5:
                while (this.jerarquia(P[P.length - 1]) >= this.jerarquia(E[E.length - 1])) {
                    S.push(P.pop());
                }
                P.push(E.pop());
                break;
            default:
                S.push(E.pop());
            }
        }

        //quita las comas y coloca espacio
        return S.toString().replace(/[,]/g, ' ').
            //quita 2 espacios de seguidos
        replace(/\s{2}/g, ' ');
    }


};

var Arbol = {

    crear: function (exprecion) {
        var posfija = Parcer.aPosFija(exprecion);

        //  posfija = "2 23 6 + * 1 -";

        var posfija = posfija.split(" ");



        //Declaración de las pilas
        var E = posfija.reverse(); //Pila entrada
        var P = []; //Pila de operandos
        console.info(E)
            //Algoritmo de Evaluación Postfija
        var operadores = "+-*/%^";
        while (E.length > 0) {
            //si es un operador
            if (operadores.contains(E[E.length - 1])) {
                P.push(this.crearNodo(E.pop(), P.pop(), P.pop()));
            } else {
                P.push(E.pop());
            }
        }

        //retorna nodos
        return P;
    },


    evaluar: function (operador, n2, n1) {
        console.info(n1 + operador + n2);

        if (operador == '^') {
            return Math.pow(n1, n2);
        }
        return eval(n1 + operador + n2);
    },
    getNumber: function (v) {
        if (isNaN(v)) {
            return v.data
        }
        return v;
    },
    getInfo: function (v) {
        //es un digito
        if (!isNaN(v)) {
            return {
                label: v
            }
        }
        //es resultado de una operacion
        return v;
    },
    crearNodo: function (operador, n2, n1) {
        return {
            label: operador,
            expanded: true,
            children: [this.getInfo(n1), this.getInfo(n2),
        ],
            data: this.evaluar(operador, this.getNumber(n2), this.getNumber(n1))
        };
    }

};