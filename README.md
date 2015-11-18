# arboles-binarios
Convierte una expresión algebraica a un arbol binario.

Operadores:
```
+ - * / ^
```
Ejemplo:Al ingresar la expresión 2+3*4+2^3 generara el siguiente arbol deacuerdo deacuerdo a la precedencia de operadores 
```
        22 =
			└── +
				├── +
				│   ├── 2
				│   └── *
				│       ├── 3
				│       └── 4
				└── ^
					├── 2
					└── 3
					
```
