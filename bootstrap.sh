# Update the local APT package index and then upgrade any 
# upgradeable packages.
apt-get update -y && apt-get upgrade -y

# Uninstall old versions of Docker
apt-get remove -y docker docker-engine docker.io containerd runc

# Install packages to allow apt to use a repository over HTTPS
apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Set up Docker's stable repository
echo \
    "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update the APT package index
apt-get update

# Install the latest versions of Docker Engine and containerd
apt-get install -y docker-ce docker-ce-cli containerd.io

# Install Node Version Manager
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash