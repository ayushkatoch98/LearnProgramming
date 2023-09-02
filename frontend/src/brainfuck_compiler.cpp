#include <iostream>
#define HEAP_SIZE 30000

// An attemp to write brainfuck compiler

const int TOTAL_KEYWORDS = 8;
const char KEYWORDS[TOTAL_KEYWORDS] = {'>' , '<', '[', ']', '+' , '-', ',', ','};


int arr[HEAP_SIZE] = {0};
int* pointer = arr;

bool look(char l){

    for (int i = 0; i < TOTAL_KEYWORDS; i++){
        if (l == KEYWORDS[i]) return true;
    }

    return false;

}


void increasePointer(){
    pointer++;
}

void decreasePointer(){
    pointer--;
}

void increaseValue(){
    (*pointer)++;
}

void decreaseValue(){
    (*pointer)--;
}

void readCode(std::string code){

    for(int i = 0; i < code.length(); i++){
        if (!look(code[i])) break;

        // valid characters;
    }

}



int main(){

    std::string code = "";
    return 0;
}