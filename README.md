# CNW-Nhom12

## Git Repository Cloner

This project provides a simple Python script to clone Git repositories.

### Features

- Clone any Git repository using a URL
- Specify a custom destination directory
- Simple command-line interface

### Usage

To clone a repository:

```bash
python3 clone_repo.py <repository_url> [destination]
```

#### Examples

Clone a repository to the default directory:
```bash
python3 clone_repo.py https://github.com/user/repo.git
```

Clone a repository to a specific directory:
```bash
python3 clone_repo.py https://github.com/user/repo.git my-custom-folder
```

### Requirements

- Python 3.x
- Git installed on your system