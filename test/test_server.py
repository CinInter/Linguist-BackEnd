import unittest
import json
import unirest
from users import data

SERVER_URL="https://linguist-backend.herokuapp.com/"
#faissal

data_dumped			= json.dumps(data) 
data_in_json_format = json.loads(data_dumped)

response_list=[]
login_token=[]
# for signup in data_in_json_format['signup']:
#     res=unirest.post(SERVER_URL+'register', headers={ "Content-Type": "application/json" }, params=json.dumps({
#     	"email": signup['email'],
#     	"password": signup['password']
#     }))

#     tmp = {}
#     tmp_res = json.loads(res.raw_body)
#     response_list.append(tmp_res['token'])

# for token in response_list:
# 	res=unirest.get(SERVER_URL+'register', headers={}, params={'token': token})


# print response.code # The HTTP status code
# print response.headers # The HTTP headers
# print response.body # The parsed response
# print response.raw_body # The unparsed response
# j = json.loads(response.raw_body)
# print j['token']

# response = unirest.get(SERVER_URL+'a')
# print response.code # The HTTP status code
# print response.headers # The HTTP headers
# print response.body # The parsed response
# print response.raw_body # The unparsed response
class TestStringMethods(unittest.TestCase):

    def test_signup(self):
    	sucess=1
    	for signup in data_in_json_format['user_credential']:
    		res=unirest.post(SERVER_URL+'register', headers={ "Content-Type": "application/json" }, params=json.dumps({
    			"email": signup['email'],
    			"password": signup['password']
    			}))
    		tmp = {}
    		tmp_res = json.loads(res.raw_body)
    		response_list.append(tmp_res['token'])
    		sucess=sucess&(tmp_res['success']==True)
    	self.assertEqual(sucess, 1)

    def test_register(self):
    	sucess=1
    	for token in response_list:
    		res=unirest.get(SERVER_URL+'register', headers={}, params={'token': token})
    		tmp = {}
    		tmp_res = json.loads(res.raw_body)
    		sucess=sucess&(tmp_res['success']==True)
    	self.assertEqual(sucess, 1)

    def test_register_user_didnt_sign_up(self):
    	sucess=1
    	token=""
    	res=unirest.get(SERVER_URL+'register', headers={}, params={'token': token})
    	tmp = {}
    	tmp_res = json.loads(res.raw_body)
    	sucess=sucess&(tmp_res['success']==True)
    	self.assertEqual(sucess, 0)

    def test_login_user(self):
    	sucess=1
    	for login in data_in_json_format['user_profile']:
    		res=unirest.get(SERVER_URL+'login', headers={}, params={
    			"email": login['email'],
    			"password": login['password']
    			})
    		tmp = {}
    		tmp_res = json.loads(res.raw_body)
    		login_token.append(tmp_res['token'])
    		sucess=sucess&(tmp_res['success']==True)
    	self.assertEqual(sucess, 1)
    
    def test_update_user(self):
    	sucess=1
    	i=0
    	for login in data_in_json_format['user_profile']:
    		res=unirest.post(SERVER_URL+'update', headers={ "Content-Type": "application/json" }, params=json.dumps({
    			"first_name": login['first_name'],
    			"last_name": login['last_name'],
    			"phone_number": login['phone_number'],
    			"profile": login['profile'],
    			"translation_fees": login['translation_fees'],
    			"bank_account": login['bank_account'],
    			"token":login_token[i]
    			}))
    		i=i+1
    		tmp = {}
    		tmp_res = json.loads(res.raw_body)
    		sucess=sucess&(tmp_res['success']==True)
    	self.assertEqual(sucess, 1)

    def test_add_languages_for_users(self):
    	sucess=1
    	i=0
    	for login in data_in_json_format['user_profile']:
    		for language in login['languages']:
    			res=unirest.post(SERVER_URL+'addLanguage', headers={ "Content-Type": "application/json" }, params=json.dumps({
    				"language": language['language'],
    				"fluency": language['fluency'],
    				"token":login_token[i]
    			}))
    		i=i+1
    		tmp = {}
    		tmp_res = json.loads(res.raw_body)
    		sucess=sucess&(tmp_res['success']==True)
    	self.assertEqual(sucess, 1)


if __name__ == '__main__':
	suite = unittest.TestSuite()
	suite.addTest(TestStringMethods('test_signup'))
	#suite.addTest(TestStringMethods('test_register'))
	#suite.addTest(TestStringMethods('test_register_user_didnt_sign_up'))
	#suite.addTest(TestStringMethods('test_login_user'))
	#suite.addTest(TestStringMethods('test_update_user'))
	#suite.addTest(TestStringMethods('test_add_languages_for_users'))
	unittest.TextTestRunner(verbosity=2).run(suite)