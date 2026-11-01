import { LanguageConfig } from '../types/compiler';

export const LANGUAGES: LanguageConfig[] = [
  {
    id: 'python',
    name: 'Python 3',
    monacoLang: 'python',
    version: '3.10.0',
    extension: '.py',
    offlineCapable: true,
    category: 'Popular',
    boilerplate: `# Python 3.10 Quickstart
import sys

def main():
    print("✨ Welcome to CodexNova Online Compiler!")
    # Read input from stdin if provided
    input_data = sys.stdin.read().split()
    if input_data:
        print(f"Stdin received: {input_data}")
    else:
        print("Tip: Provide input in the Stdin tab below to test interactive programs.")

if __name__ == "__main__":
    main()
`,
    snippets: [
      {
        title: 'Two Sum (Hash Map O(N))',
        description: 'Find two indices that sum up to target',
        code: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []

# Test with array and target
numbers = [2, 7, 11, 15]
target = 9
result = two_sum(numbers, target)
print(f"Numbers: {numbers}, Target: {target}")
print(f"Indices: {result} -> Values: {[numbers[i] for i in result]}")
`,
      },
      {
        title: 'Interactive Stdin Sum',
        description: 'Reads integers from standard input and prints total',
        sampleStdin: '10 25 35 50',
        code: `import sys

# Read space or newline separated numbers from stdin
data = sys.stdin.read().split()
if not data:
    print("Please provide space-separated numbers in the Stdin tab!")
else:
    numbers = [int(x) for x in data]
    print(f"Read {len(numbers)} numbers: {numbers}")
    print(f"Sum: {sum(numbers)}")
    print(f"Average: {sum(numbers)/len(numbers):.2f}")
`,
      },
      {
        title: 'Fibonacci with Memoization',
        description: 'DP memoization demonstration',
        code: `from functools import lru_cache
import time

@lru_cache(maxsize=None)
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

for i in range(15):
    print(f"F({i}) = {fib(i)}")
`,
      },
    ],
  },
  {
    id: 'cpp',
    name: 'C++ (G++ 10.2)',
    monacoLang: 'cpp',
    version: '10.2.0',
    extension: '.cpp',
    offlineCapable: false,
    category: 'Systems',
    boilerplate: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    cout << "🚀 CodexNova C++ Engine initialized!\\n";
    cout << "Standard: C++20 / GCC 10.2.0\\n";

    string inputToken;
    if (cin >> inputToken) {
        cout << "First token from stdin: " << inputToken << "\\n";
    }
    return 0;
}
`,
    snippets: [
      {
        title: 'Fast I/O & Vector Sorting',
        description: 'Modern STL vector manipulation',
        sampleStdin: '5\n42 17 99 8 23',
        code: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    int n;
    if (cin >> n) {
        vector<int> arr(n);
        for (int i = 0; i < n; ++i) {
            cin >> arr[i];
        }
        sort(arr.begin(), arr.end());
        cout << "Sorted array (" << n << " elements):\\n";
        for (int x : arr) cout << x << " ";
        cout << "\\n";
    } else {
        cout << "Provide 'N' followed by N integers in Stdin tab.\\n";
    }
    return 0;
}
`,
      },
      {
        title: 'Binary Search Implementation',
        description: 'Recursive & iterative binary search',
        code: `#include <iostream>
#include <vector>

using namespace std;

int binarySearch(const vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}

int main() {
    vector<int> data = {3, 9, 14, 21, 33, 45, 67, 88, 92};
    int target = 33;
    int idx = binarySearch(data, target);
    cout << "Target " << target << " found at index: " << idx << "\\n";
    return 0;
}
`,
      },
    ],
  },
  {
    id: 'javascript',
    name: 'JavaScript (Node.js)',
    monacoLang: 'javascript',
    version: '18.15.0',
    extension: '.js',
    offlineCapable: true,
    category: 'Web',
    boilerplate: `// JavaScript (Node.js 18.x) Environment
const fs = require('fs');

function run() {
  console.log("⚡ CodexNova JavaScript Environment Ready");
  
  // Checking stdin
  try {
    const input = fs.readFileSync(0, 'utf-8').trim();
    if (input) {
      console.log("Stdin content:", input);
    }
  } catch (e) {
    // Stdin empty
  }
}

run();
`,
    snippets: [
      {
        title: 'Async Event Loop & Promises',
        description: 'Demonstrating microtasks & async resolution',
        code: `console.log("1: Synchronous start");

setTimeout(() => {
  console.log("4: Macrotask (setTimeout)");
}, 0);

Promise.resolve().then(() => {
  console.log("3: Microtask (Promise)");
});

console.log("2: Synchronous end");
`,
      },
      {
        title: 'LRU Cache Pattern',
        description: 'O(1) Get/Put with Map',
        code: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, value);
  }
}

const lru = new LRUCache(2);
lru.put("a", 100);
lru.put("b", 200);
console.log("Get a:", lru.get("a"));
lru.put("c", 300); // evicts b
console.log("Get b (should be -1):", lru.get("b"));
console.log("Get c:", lru.get("c"));
`,
      },
    ],
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    monacoLang: 'typescript',
    version: '5.0.3',
    extension: '.ts',
    offlineCapable: true,
    category: 'Web',
    boilerplate: `// TypeScript 5.x
interface Developer {
  name: string;
  role: string;
  languages: string[];
  experienceYears: number;
}

const dev: Developer = {
  name: "Alex Rivera",
  role: "Systems Architect",
  languages: ["TypeScript", "Rust", "Python"],
  experienceYears: 7
};

console.log(\`CodexNova TS: Hello \${dev.name} (\${dev.role})!\`);
console.log(\`Stack: \${dev.languages.join(", ")}\`);
`,
    snippets: [
      {
        title: 'Type-Safe State Machine',
        description: 'Discriminated unions & exhaustive pattern matching',
        code: `type State = 
  | { status: 'idle' }
  | { status: 'loading'; progress: number }
  | { status: 'success'; data: string[] }
  | { status: 'error'; message: string };

function renderState(state: State): string {
  switch (state.status) {
    case 'idle':
      return "Waiting to begin...";
    case 'loading':
      return \`Loading: \${state.progress}%\`;
    case 'success':
      return \`Success! Received \${state.data.length} records.\`;
    case 'error':
      return \`Failed: \${state.message}\`;
  }
}

console.log(renderState({ status: 'loading', progress: 45 }));
console.log(renderState({ status: 'success', data: ['item1', 'item2'] }));
`,
      },
    ],
  },
  {
    id: 'java',
    name: 'Java (OpenJDK 15)',
    monacoLang: 'java',
    version: '15.0.2',
    extension: '.java',
    offlineCapable: false,
    category: 'Popular',
    boilerplate: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        System.out.println("☕ CodexNova Java Virtual Machine 15.0.2");
        
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNext()) {
            String line = scanner.nextLine();
            System.out.println("Stdin line read: " + line);
        } else {
            System.out.println("No stdin provided. Try entering text in the Stdin tab!");
        }
        scanner.close();
    }
}
`,
    snippets: [
      {
        title: 'Valid Parentheses (Stack)',
        description: 'Bracket matching using java.util.ArrayDeque',
        code: `import java.util.ArrayDeque;
import java.util.Deque;

public class Main {
    public static boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }

    public static void main(String[] args) {
        String test1 = "{[()]}";
        String test2 = "([)]";
        System.out.println(test1 + " -> " + isValid(test1));
        System.out.println(test2 + " -> " + isValid(test2));
    }
}
`,
      },
    ],
  },
  {
    id: 'rust',
    name: 'Rust (1.68.2)',
    monacoLang: 'rust',
    version: '1.68.2',
    extension: '.rs',
    offlineCapable: false,
    category: 'Systems',
    boilerplate: `use std::io::{self, Read};

fn main() {
    println!("🦀 Rust 1.68.2 Engine Activated!");
    
    let mut buffer = String::new();
    let _ = io::stdin().read_to_string(&mut buffer);
    
    if !buffer.trim().is_empty() {
        println!("Stdin received: {}", buffer.trim());
    } else {
        println!("Tip: Zero-cost abstractions and memory safety without garbage collection.");
    }
}
`,
    snippets: [
      {
        title: 'Pattern Matching & Result Handling',
        description: 'Idiomatic error handling with Result and Option',
        code: `#[derive(Debug)]
enum MathError {
    DivisionByZero,
    NegativeSquareRoot,
}

fn safe_divide(a: f64, b: f64) -> Result<f64, MathError> {
    if b == 0.0 {
        Err(MathError::DivisionByZero)
    } else {
        Ok(a / b)
    }
}

fn main() {
    let pairs = [(10.0, 2.0), (8.0, 0.0), (100.0, 4.0)];
    for (a, b) in pairs {
        match safe_divide(a, b) {
            Ok(res) => println!("{a} / {b} = {res}"),
            Err(e) => println!("Error computing {a} / {b}: {e:?}"),
        }
    }
}
`,
      },
    ],
  },
  {
    id: 'go',
    name: 'Go (Golang 1.16)',
    monacoLang: 'go',
    version: '1.16.2',
    extension: '.go',
    offlineCapable: false,
    category: 'Systems',
    boilerplate: `package main

import (
	"bufio"
	"fmt"
	"os"
)

func main() {
	fmt.Println("🐹 CodexNova Go 1.16.2 Runtime")
	
	scanner := bufio.NewScanner(os.Stdin)
	if scanner.Scan() {
		fmt.Printf("Stdin: %s\\n", scanner.Text())
	} else {
		fmt.Println("Concurrency with goroutines and channels ready.")
	}
}
`,
    snippets: [
      {
        title: 'Goroutines & Channels Pipeline',
        description: 'Concurrent worker pattern in Go',
        code: `package main

import (
	"fmt"
	"sync"
)

func worker(id int, jobs <-chan int, results chan<- int, wg *sync.WaitGroup) {
	defer wg.Done()
	for j := range jobs {
		results <- j * j
	}
}

func main() {
	const numJobs = 6
	jobs := make(chan int, numJobs)
	results := make(chan int, numJobs)
	var wg sync.WaitGroup

	for w := 1; w <= 3; w++ {
		wg.Add(1)
		go worker(w, jobs, results, &wg)
	}

	for j := 1; j <= numJobs; j++ {
		jobs <- j
	}
	close(jobs)

	wg.Wait()
	close(results)

	for r := range results {
		fmt.Printf("Computed square: %d\\n", r)
	}
}
`,
      },
    ],
  },
  {
    id: 'c',
    name: 'C (GCC 10.2)',
    monacoLang: 'c',
    version: '10.2.0',
    extension: '.c',
    offlineCapable: false,
    category: 'Systems',
    boilerplate: `#include <stdio.h>

int main(void) {
    printf("⚙️ CodexNova C Runtime (GCC 10.2)\\n");
    char buffer[256];
    if (fgets(buffer, sizeof(buffer), stdin)) {
        printf("Stdin input: %s", buffer);
    }
    return 0;
}
`,
    snippets: [
      {
        title: 'Pointers & Dynamic Memory',
        description: 'malloc, pointer traversal, and memory cleanup',
        code: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n = 5;
    int *arr = (int *)malloc(n * sizeof(int));
    if (!arr) return 1;

    for (int i = 0; i < n; i++) {
        *(arr + i) = (i + 1) * 10;
    }

    printf("Array values via pointer arithmetic:\\n");
    for (int i = 0; i < n; i++) {
        printf("Index %d (address %p): %d\\n", i, (void *)(arr + i), *(arr + i));
    }

    free(arr);
    return 0;
}
`,
      },
    ],
  },
  {
    id: 'sql',
    name: 'SQL (SQLite 3.36)',
    monacoLang: 'sql',
    version: '3.36.0',
    extension: '.sql',
    offlineCapable: true,
    category: 'Data & DB',
    boilerplate: `-- SQLite 3 Interactive Session
CREATE TABLE developers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    language TEXT NOT NULL,
    years_exp INTEGER
);

INSERT INTO developers (name, language, years_exp) VALUES
    ('Priya Sharma', 'Python', 4),
    ('Arjun Verma', 'Go', 6),
    ('Meera Patel', 'Rust', 3),
    ('Rohan Nair', 'TypeScript', 5);

SELECT * FROM developers WHERE years_exp >= 4 ORDER BY years_exp DESC;
`,
    snippets: [
      {
        title: 'Window Functions & Aggregation',
        description: 'DENSE_RANK() and Department analytics',
        code: `CREATE TABLE salaries (
    emp_id INTEGER,
    dept TEXT,
    salary INTEGER
);

INSERT INTO salaries VALUES
    (1, 'Engineering', 95000),
    (2, 'Engineering', 120000),
    (3, 'Engineering', 120000),
    (4, 'Design', 85000),
    (5, 'Design', 92000);

SELECT 
    dept,
    emp_id,
    salary,
    DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC) as rank_in_dept
FROM salaries;
`,
      },
    ],
  },
  {
    id: 'bash',
    name: 'Bash Shell (5.2)',
    monacoLang: 'shell',
    version: '5.2.0',
    extension: '.sh',
    offlineCapable: false,
    category: 'Scripting',
    boilerplate: `#!/usr/bin/env bash
# CodexNova Bash Sandbox

echo "🐚 POSIX / Bash 5.2 Terminal Environment"
echo "Host Kernel: $(uname -s) $(uname -m)"
echo "Current Date: $(date)"

# Reading stdin line if available
if read -t 1 -r line; then
    echo "Stdin line: $line"
else
    echo "Ready for commands and pipe operations."
fi
`,
    snippets: [
      {
        title: 'Pipes, Grep & Awk',
        description: 'Text stream transformation',
        code: `cat << 'EOF' | awk -F',' '{if ($3 > 50) print $1 " -> $" $3}'
Apple,Fruit,30
Laptop,Electronics,1200
Book,Education,45
Smartphone,Electronics,800
EOF
`,
      },
    ],
  },
  {
    id: 'ruby',
    name: 'Ruby (3.0.1)',
    monacoLang: 'ruby',
    version: '3.0.1',
    extension: '.rb',
    offlineCapable: false,
    category: 'Scripting',
    boilerplate: `# Ruby 3.0.1
puts "💎 CodexNova Ruby Engine"

langs = ["Ruby", "Crystal", "Elixir"]
puts "Expressive languages:"
langs.each_with_index do |lang, idx|
  puts "#{idx + 1}. #{lang}"
end
`,
    snippets: [
      {
        title: 'Blocks & Enumerables',
        description: 'Elegant Ruby collection transformations',
        code: `words = %w[apple banana cherry date elderberry fig grape]

grouped = words.group_by(&:length)
puts "Grouped by character count:"
grouped.each do |len, items|
  puts "#{len} letters: #{items.join(', ')}"
end
`,
      },
    ],
  },
  {
    id: 'php',
    name: 'PHP (8.2.3)',
    monacoLang: 'php',
    version: '8.2.3',
    extension: '.php',
    offlineCapable: false,
    category: 'Web',
    boilerplate: `<?php
// PHP 8.2 Modern Engine
echo "🐘 CodexNova PHP 8.2.3 CLI Engine\\n";

$data = [
    'runtime' => 'PHP 8.2 JIT',
    'status' => 'active',
    'features' => ['Readonly Classes', 'Nullsafe Operator', 'Match Expressions']
];

echo json_encode($data, JSON_PRETTY_PRINT) . "\\n";
`,
    snippets: [
      {
        title: 'Match Expressions & Enums',
        description: 'Modern PHP 8 control structures',
        code: `<?php
$statusCode = 404;

$message = match ($statusCode) {
    200, 201 => 'Success: Request fulfilled',
    400 => 'Client Error: Bad Request',
    404 => 'Client Error: Resource Not Found',
    500 => 'Server Error: Internal Failure',
    default => 'Unknown Status Code',
};

echo "HTTP {$statusCode}: {$message}\\n";
`,
      },
    ],
  },
];
