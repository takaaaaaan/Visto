from summurize import *
from db_control import *

country_list = [['CAN', 'EN'],
                ['CHN', 'ZH'],
                ['GBR', 'EN'],
                ['JPN', 'JA'],
                ['KOR', 'KO'],
                ['USA', 'EN']]

def run():
    result_list = []
    initialize_db()
    for country in country_list:    # url로 페이지에 있는 내용 요약
        total_summurize_text = ''    # 국가별 요약 내용을 전부 합쳐서 요약하기위함
        firebase_country_set = 'searchResults/' + country[0] + '/' + country[1]    # db에 있는 url 찾기 위한 국가 경로 선정
        for i in range(0,10):
            firebase_number_set = firebase_country_set + '/data/items/' + str(i)    # db에 있는 문서 번호 선정

            firebase_query_path = firebase_country_set + '/query'    # db에 있는 사용자 질문 경로
            firebase_url_path = firebase_number_set + '/formattedUrl'    # db에 있는 url 경로
            try:
                urls = read_db(firebase_url_path).get()
                query = read_db(firebase_query_path).get()
                if urls is not None and 'youtube' not in urls.lower() and not urls.lower().endswith('.pdf'):    # youtube or pdf 파일은 넘기기
                    summurized_text = link_search(urls, query)
                    print('\n\n\n')
                    print(country[0])
                    print('\n')
                    print(summurized_text)
                    update_db(firebase_number_set, summurized_text)    # 요약된 내용 db에 업로드
                    if 'No Data' not in summurized_text and summurized_text is not None:
                        total_summurize_text += summurized_text
            except Exception as ex:
                print(ex)
                continue
        if total_summurize_text.strip():
            result_list.append([country[0], country[1], total_summurize_text, query])
    for result in result_list:
        update_db('searchResults/'+ result[0] + '/' + result[1] + '/data/summaryByCountry', summary_by_country(result[2], result[3]))
    print(result)
run()