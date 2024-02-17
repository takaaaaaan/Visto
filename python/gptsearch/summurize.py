from openai import AzureOpenAI
from langchain_community.document_loaders import SeleniumURLLoader


def link_search(urls, query):
    if isinstance(urls, str):    # url이 문자열로 들어오는데 리스트 형식으로 바꿔줘야함
        urls = [urls]
    loader = SeleniumURLLoader(urls=urls)
    data = loader.load()    # 페이지의 내용 불러오기

    client = AzureOpenAI(
        api_key="f8ac1f51bb7b42e096cb1d08a9e1666e",
        api_version="2023-07-01-preview",
        azure_endpoint="https://kic-2024-openai.openai.azure.com/"
    )

    response = client.chat.completions.create(
        # model = "deployment_name".
        model="694b2ca9-4c7f-4ba0-906a-8c037c1d80e1",
        messages=[
            {"role": "system", "content": """provide a summary and answers to user questions in Korean. 
             If it is already written in Korean, just summarize and answer the questions."""},
            {"role": "user", "content": f"""Summarize the contents of {data} and prepare an answer to the user question {query} with a summary in Korean.
             And if it is not related to the user question, you only need to reply 'No Data'. 
             If it is already written in Korean, please provide the summary and the answer to the user question only."""}
        ]
    )

    # print(response)
    # print(response.model_dump_json(indent=2))
    # print(response.choices[0].message.content)    # 요약 내용 확인

    return response.choices[0].message.content


def summary_by_country(data, query):
    client = AzureOpenAI(
        api_key="f8ac1f51bb7b42e096cb1d08a9e1666e",
        api_version="2023-07-01-preview",
        azure_endpoint="https://kic-2024-openai.openai.azure.com/"
    )

    response = client.chat.completions.create(
        # model = "deployment_name".
        model="694b2ca9-4c7f-4ba0-906a-8c037c1d80e1",
        messages=[
            {"role": "system", "content": """provide a summary and answers to user questions in Korean. 
             If it is already written in Korean, just summarize and answer the questions."""},
            {"role": "user", "content": f"""Summarize the contents of {data} and prepare an answer to the user question {query} with a summary in Korean.
             And if it is not related to the user question, you only need to reply 'No Data'. 
             If it is already written in Korean, please provide the summary and the answer to the user question only."""}
        ]
    )

    return response.choices[0].message.content
