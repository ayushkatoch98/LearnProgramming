#include <iostream>


void printVec(std::vector<int> vec){
    std::cout << "Vector Size is " << vec.size() << std::endl;
    for(int i = 0; i < vec.size(); i++){
        std::cout << vec[i] << " , ";
    }

}

// O(n) | O(n)
std::string reversal1(std::string str){
    std::string output = "";
    for(int i = str.length() - 1; i >= 0; i--){
        output += str[i];
    }
    return output;
}

// O(1) | O(n/2)


std::string reversal2(std::string str){
    int startI = 0;
    int endI = str.length() - 1;
    while(startI < endI){

        int temp = str[startI];
        str[startI] = str[endI];
        str[endI] = temp;

        startI++;
        endI--;
    }   

    return str;
    
}

int main(){
    // vector<int> vect1({10, 20, 30});

    int arr[] = {50,20,10,60,200,100,-100,15};
    
    std::vector<int> vec(arr, arr+8);

    sort(vec.begin(), vec.end());
    reverse(vec.begin(), vec.end());

    // get vector size 
    // vec.size();
    // add elements at the end / back
    // vec.push_back(value);

    // insert at a specific index
    // vec.insert(vec.begin() + indexWhereYouWantToInsert, value);

    // replace element
    // vec[4] = 10; 

    // remove 
    // vec.erase(vec.begin() + removalStartIndex , vec.begin() + numOfelementToRemove);

    // int a = 'a';
    // int z = 'z';

    // int A = 'A';
    // int Z = 'Z';

    // int zero = '0';
    // int nine = '9';

    // int space = ' ';
    

    // std::cout << a << " | " << z << " | " << A << " | " << Z << " | " << zero << " | " << nine << " | " << space << std::endl;

    // std::cout << "Before " << std::endl;
    // printVec(vec);
    // std::cout << "\nAfter " << std::endl;
    // vec.erase(vec.begin() + 2, vec.begin() + 4);
    printVec(vec);

    std::string a = "HelloWorld";

    std::cout << reversal1(a) << std::endl;

    std::cout << reversal2(a) << std::endl;

    return 0;

}