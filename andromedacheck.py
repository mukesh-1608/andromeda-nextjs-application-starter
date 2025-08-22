import requests
import json
import base64
import time

# --- Configuration ---
# These are the values from your original marketplace/page.tsx file.
REST_ENDPOINT = 'https://api.testnet.andromeda-protocol.io'
MARKETPLACE_CONTRACT_ADDRESS = 'andr1a243c32szfdgq07e0a7vdukj8h065txvrzsy4kp8k9973604f9jspxmy3y'
CW721_CONTRACT_ADDRESS = 'andr1m3dq2q20x239d3ccxvdeumasay09dexj5c5w26dwa7yypqgx4djsr0yecx'
TOKEN_ID = "Cow01"
REQUEST_TIMEOUT = 15  # seconds

# --- ANSI Color Codes for better output ---
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def print_step(message):
    print(f"\n{Colors.HEADER}STEP: {message}{Colors.ENDC}")

def print_success(message):
    print(f"{Colors.OKGREEN}✅ SUCCESS: {message}{Colors.ENDC}")

def print_failure(message, details=""):
    print(f"{Colors.FAIL}❌ FAILURE: {message}{Colors.ENDC}")
    if details:
        print(f"{Colors.WARNING}   Details: {details}{Colors.ENDC}")

def check_endpoint():
    """
    A robust script to check the health and responses of the Andromeda testnet endpoints.
    """
    print(f"{Colors.BOLD}🚀 Starting Andromeda Endpoint Health Check...{Colors.ENDC}")
    print(f"   Testing against: {Colors.UNDERLINE}{REST_ENDPOINT}{Colors.ENDC}")
    
    # === STEP 1: Query for the sale info on the marketplace ===
    print_step("Querying Marketplace for sale info...")
    try:
        sales_query = {"sales": {"nft_contract_address": CW721_CONTRACT_ADDRESS, "token_id": TOKEN_ID}}
        # In Python, we don't need to manually base64 encode the query for requests library
        # but we will to perfectly replicate the client-side logic.
        sales_query_str = json.dumps(sales_query)
        sales_query_base64 = base64.b64encode(sales_query_str.encode('utf-8')).decode('utf-8')
        
        sales_url = f"{REST_ENDPOINT}/cosmwasm/wasm/v1/contract/{MARKETPLACE_CONTRACT_ADDRESS}/smart/{sales_query_base64}"
        print(f"   Requesting URL: {Colors.OKCYAN}{sales_url}{Colors.ENDC}")

        response = requests.get(sales_url, timeout=REQUEST_TIMEOUT)
        
        # Check for HTTP errors
        response.raise_for_status()
        
        sales_data = response.json()
        print_success("Received a successful response from the marketplace.")
        
        sale = sales_data.get('data', {}).get('sales', [])
        if not sale:
            print_failure("Marketplace response OK, but no sale found for the specified NFT.", f"Token ID: {TOKEN_ID}")
            return
        else:
            print_success(f"Found sale info for Token ID: {TOKEN_ID}")
            print(json.dumps(sale[0], indent=2))
            
    except requests.exceptions.Timeout:
        print_failure("The request to the marketplace timed out.", f"Timeout was set to {REQUEST_TIMEOUT} seconds.")
        return
    except requests.exceptions.HTTPError as http_err:
        print_failure("An HTTP error occurred while querying the marketplace.", f"Status Code: {http_err.response.status_code}, Response: {http_err.response.text}")
        return
    except requests.exceptions.RequestException as req_err:
        print_failure("A network request error occurred.", str(req_err))
        return
    except json.JSONDecodeError:
        print_failure("Failed to parse JSON response from the marketplace.", f"Received: {response.text}")
        return
    except Exception as e:
        print_failure("An unexpected error occurred during the marketplace query.", str(e))
        return

    # === STEP 2: Query for the NFT's metadata from the CW721 contract ===
    print_step("Querying CW721 contract for NFT metadata URI...")
    try:
        nft_info_query = {"nft_info": {"token_id": TOKEN_ID}}
        nft_info_query_str = json.dumps(nft_info_query)
        nft_info_query_base64 = base64.b64encode(nft_info_query_str.encode('utf-8')).decode('utf-8')

        nft_info_url = f"{REST_ENDPOINT}/cosmwasm/wasm/v1/contract/{CW721_CONTRACT_ADDRESS}/smart/{nft_info_query_base64}"
        print(f"   Requesting URL: {Colors.OKCYAN}{nft_info_url}{Colors.ENDC}")

        response = requests.get(nft_info_url, timeout=REQUEST_TIMEOUT)
        response.raise_for_status()
        
        nft_info_data = response.json()
        print_success("Received a successful response from the CW721 contract.")

        token_uri = nft_info_data.get('data', {}).get('token_uri')
        if not token_uri:
            print_failure("CW721 response OK, but 'token_uri' is missing.")
            return
        else:
            print_success(f"Found Token URI: {token_uri}")

    except requests.exceptions.Timeout:
        print_failure("The request to the CW721 contract timed out.", f"Timeout was set to {REQUEST_TIMEOUT} seconds.")
        return
    except requests.exceptions.HTTPError as http_err:
        print_failure("An HTTP error occurred while querying the CW721 contract.", f"Status Code: {http_err.response.status_code}, Response: {http_err.response.text}")
        return
    except requests.exceptions.RequestException as req_err:
        print_failure("A network request error occurred.", str(req_err))
        return
    except json.JSONDecodeError:
        print_failure("Failed to parse JSON response from the CW721 contract.", f"Received: {response.text}")
        return
    except Exception as e:
        print_failure("An unexpected error occurred during the CW721 query.", str(e))
        return

    # === STEP 3: Fetch the actual metadata from the IPFS gateway ===
    print_step("Fetching metadata from IPFS gateway...")
    try:
        # Replace ipfs:// with a public gateway if necessary
        if token_uri.startswith('ipfs://'):
            ipfs_gateway = "https://ipfs.io/ipfs/"
            metadata_url = token_uri.replace('ipfs://', ipfs_gateway)
            print(f"   Converting IPFS URI to gateway URL: {Colors.OKCYAN}{metadata_url}{Colors.ENDC}")
        else:
            metadata_url = token_uri
            print(f"   Requesting URL: {Colors.OKCYAN}{metadata_url}{Colors.ENDC}")

        response = requests.get(metadata_url, timeout=REQUEST_TIMEOUT)
        response.raise_for_status()

        metadata = response.json()
        print_success("Successfully fetched and parsed metadata from the gateway.")
        print(json.dumps(metadata, indent=2))

    except requests.exceptions.Timeout:
        print_failure("The request to the metadata gateway timed out.", f"Timeout was set to {REQUEST_TIMEOUT} seconds.")
        return
    except requests.exceptions.HTTPError as http_err:
        print_failure("An HTTP error occurred while fetching metadata.", f"Status Code: {http_err.response.status_code}, Response: {http_err.response.text}")
        return
    except requests.exceptions.RequestException as req_err:
        print_failure("A network request error occurred.", str(req_err))
        return
    except json.JSONDecodeError:
        print_failure("Failed to parse JSON response from the metadata gateway.", f"Received: {response.text}")
        return
    except Exception as e:
        print_failure("An unexpected error occurred during metadata fetching.", str(e))
        return
        
    print(f"\n{Colors.BOLD}🚀 Health Check Complete!{Colors.ENDC}")


if __name__ == "__main__":
    check_endpoint()
