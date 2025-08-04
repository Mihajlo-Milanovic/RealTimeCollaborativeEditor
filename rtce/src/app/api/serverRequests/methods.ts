const server_address = "http://localhost:5000"// process.env.SERVER_ADDRESS

export async function getRequestSingle(method_route: string, param: string, param_value: string | null) {
    method_route = method_route.trim();
    param = param.trim();
    const url = server_address + "/" + method_route + "?" + param + "=" + param_value;
    const res = await fetch(url, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        },
  });

  return res;
}

export async function postRequest(method_route: string, data: any) {
    method_route = method_route.trim();
    const url = server_address + "/" + method_route; 
    const res = await fetch(url, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
  });

    return res;
}

export async function putRequest(method_route: string, data: any) {
    method_route = method_route.trim();
    const url = server_address + "/" + method_route; 
    const res = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    return res;
}

export async function deleteRequest(method_route: string, param?: string, param_value?: string, data?: any) {
    method_route = method_route.trim();
    let url = server_address + "/" + method_route;

    if (param !== undefined && param_value !== undefined)
        url += "?" + param + "=" + param_value;

    const options: RequestInit = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    };

    if (data !== undefined) {
        options.body = JSON.stringify(data);
    }

    const res = await fetch(url, options);
    return res;
}