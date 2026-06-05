export const LANGUAGES = [
    { label: "JavaScript", value: "javascript" },
    { label: "Python", value: "python" },
    { label: "c++", value: "cpp" },
    { label: "Java", value: "jva" },
    { label: "Typescript", value: "typescript" },
]

export const DEFAULT_CODE = {
    javascript: `function hello() {\n console.log("Hello from CodeSync!");\n}`,
    python:     `def hello():\n  print("Hello from CodeSync!")`,
    cpp:        `#include<iostream>\n using namespace std;\n int main() {\n cout<< "Hello from CodeSync!";\n return 0; \n}`,
    java:       `public class Main {\n public static void main(String[] args) {\n   System.out.println("Hello from CodeSync!");\n }\n}`,
    typescript: `function hello(): void {\n console.log("Hello from CodeSync!");\n }`, 
}