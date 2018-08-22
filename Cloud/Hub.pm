package Web::Cloud::Hub;
use Moose::Role;
use Method::Signatures::Simple;

=head2

	PACKAGE		Web::Cloud::Hub
	
	PURPOSE
	
		HUB ACCESS MANAGEMENT METHODS FOR Web
	
=cut

#### HUB
method _getHub ($username) {
	my $query = qq{SELECT * FROM hub
WHERE username='$username'};
	$self->logDebug("query", $query);
	
	return $self->db()->queryhash($query) || {};
}

method addHub ($data) {
	#### CHECK IF THE USER ALREADY HAS STORED AWS INFO,
	#### IN WHICH CASE QUIT
	my $table 		= 	"hub";
	my $username 	= 	$data->{username};
	my $success;
	if ( $self->db()->inTable($table, $data, ["username", "login"]) ) {
		$success	=	$self->_updateHub($data);
	}
	else {
		$success 	=	$self->_addHub($data);
	}
	if ( not $success ) {
		$self->notifyError($data, "Failed to add hub for login: $data->{login}");
	}
	else {
	 	$self->notifyStatus($data, "Added repo notifyin $data->{notifyin}");
	}
}

method _addHub ($data) {
	#### SET TABLE AND REQUIRED FIELDS	
	my $table = "hub";
	my $required_fields = ["username"];

	#### CHECK REQUIRED FIELDS ARE DEFINED
	my $undefined = $self->db()->notDefined($data, $required_fields);
    $self->logError("undefined values: @$undefined") and return 0 if @$undefined;
	
	#### DO THE ADD
	return $self->_addToTable($table, $data, $required_fields);	
}

method _updateHub ($data) {
	my $table = "hub";
	my $username = $data->{username};
	my $login = $data->{login};
	my $hubtype = $data->{hubtype};
	my $query = qq{UPDATE $table
	SET login='$login',
	hubtype = '$hubtype'
	WHERE username='$username'};
	$self->logDebug("$query");
	
	return $self->db()->do($query);
}

method _removeHub ($data) {
#### ADD aws TABLE ENTRY
	#### SET TABLE AND REQUIRED FIELDS	
	my $table = "hub";
	my $required_fields = ["username"];

	#### CHECK REQUIRED FIELDS ARE DEFINED
	my $undefined = $self->db()->notDefined($data, $required_fields);
    $self->logError("undefined values: @$undefined") and return 0 if @$undefined;
	
	#### DO THE ADD
	return $self->_removeFromTable($table, $data, $required_fields);	
}

#### HUB TOKEN
method generateHubToken ($data) {
	my $username 	= $data->{username};	
	my $login 		= $data->{login};
	my $password 	= $data->{password};
	my $hubtype 	= $data->{hubtype};
	
	#### CHECK REQUIRED FIELDS ARE DEFINED
	my $fields = ["username", "login", "password", "hubtype"];
	my $undefined = $self->db()->notDefined($data, $fields);
    $self->notifyError($data, "undefined values: @$undefined") and return if @$undefined;

	#### SET ops HUB TYPE	
	$self->head()->ops()->setHubType($hubtype) if not $self->head()->ops()->hubtype() eq $hubtype;

	#### ADD hub IF NOT EXISTS
	my $hub = $self->_getHub($username);
	$self->notifyError("username not defined") and return if not defined $hub;

	my $tokenid = $hub->{tokenid};
	$self->logDebug("hub", $hub);
	if ( not defined $hub ) {
		$self->logDebug("Doing _addHub(data)");
		$self->_addHub($data)
	}
	#### OTHERWISE, REMOVE 'agua' TOKEN IF ALREADY EXISTS
	else {
		$self->logDebug("Doing _removeOAuthToken(...)");
		$self->head()->ops()->removeOAuthToken($login, $password, $tokenid) if defined $tokenid;
	}

	#### ADD TOKEN 'agua'
	$self->logDebug("Doing _addHubToken(");
	my $token;
	($token, $tokenid) = $self->head()->ops()->addOAuthToken($login, $password, $hubtype, $tokenid);
	$data->{token} 		= 	$token;
	$data->{tokenid} 	= 	$tokenid;
	$self->logDebug("data", $data);
	
	#### UPDATE hub TABLE WITH token AND tokeinid
	my $success = $self->_addHubToken($data);
	if ( not $success ) {
		$self->notifyError($data, "Failed to update OAuth Token", $token);
	}
	else {
		$self->notifyStatus($data, "Created hub token: $token");
	}
}

method _addHubToken ($data) {	
	#### CHECK REQUIRED FIELDS ARE DEFINED
	my $required_keys = ["username", "login", "hubtype", "token", "tokenid"];
	my $undefined = $self->db()->notDefined($data, $required_keys);
    if ( @$undefined ) {
		$self->logDebug("not defined", $undefined);
		$self->notifyError($data, "undefined values: @$undefined");
		return 0;
	}

	#### CHECK IF ENTRY IN TABLE
	my $table = "hub";
	my $keys = ["username", "login"];
	my $exists = $self->db()->inTable($table, $data, $keys);
	$self->logDebug("exists", $exists);
	
	#### IF ENTRY EXISTS, UPDATE ENTRY
	if ( $exists ) {
		$self->logDebug("updating entry");
		my $result = $self->db()->_updateTable($table, $data, $keys, $data, ["token", "tokenid"]);
		$self->logDebug("result", $result);
		return $result;
	}
	#### OTHERWISE, INSERT NEW ENTRY
	else {
		$self->logDebug("inserting new entry");
		my $fields = $self->db()->fields($table);
		my $result = $self->db()->_addToTable($table, $data, $keys, $fields);
		$self->logDebug("result", $result);
		return $result;
	}
}

method removeHubToken ($data) {
	my $username 	= $data->{username};	
	my $login 		= $data->{login};
	my $password 	= $data->{password};
	my $hubtype 	= $data->{hubtype};

	#### CHECK REQUIRED FIELDS ARE DEFINED
	my $keys = ["username", "login", "hubtype", "token", "tokenid"];
	my $undefined = $self->db()->notDefined($data, $keys);
    $self->notifyError($data, "undefined values: @$undefined") and return if @$undefined;

	#### CHECK IF ENTRY IN TABLE
	my $table = "hub";
	return $self->db()->_removeFromTable($table, $data, $keys);
}

method _removeHubToken ($data) {
	$self->logDebug("data", $data);
	
	#### CHECK REQUIRED FIELDS ARE DEFINED
	my $keys = ["username", "login", "hubtype", "token", "tokenid"];
	my $undefined = $self->db()->notDefined($data, $keys);
    $self->logError("undefined values: @$undefined") and return 0 if @$undefined;

	#### CHECK IF ENTRY IN TABLE
	my $table = "hub";
	return $self->db()->_removeFromTable($table, $data, $keys);
}

#### HUB CERTIFICATE
method addHubCertificate ($data) {
	$self->logDebug("data", $data);
	my $username 	= $data->{username};	
	my $login 		= $data->{login};
	my $hubtype 	= $data->{hubtype};

	#### SET KEYFILE
	my $hub = $self->_getHub($username);
	$self->notifyError("username not defined") and return if not defined $hub;
	my $keyfile = $self->setHubKeyfile($username, $login, $hubtype);
	$self->logDebug("keyfile", $keyfile);
	$hub->{keyfile} = $keyfile;
	my $success = $self->_updateHubKeyfile($hub);
	if ( not $success ) {
		$self->notifyError($data, "Can't update hub keyfile");
		return;
	}	
	
	#### CREATE HUB KEYS FROM PRIVATE KEY IN aws TABLE
	my $publiccert = $self->_generateHubKeys($username, $login, $hubtype, $keyfile);
	$data->{publiccert} = $publiccert;
	$self->notifyError($data, "Can't generate hub keys") and return if not defined $publiccert;

	my $table 	= 	"hub";
	my $keys 	= 	["username", "login"];
	$hub->{publiccert}	=	$publiccert;
	$hub->{hubtype}		=	$hubtype;
	$hub->{login}		=	$login;
	my $result = $self->db()->_updateTable($table, $hub, $keys, $hub, ["publiccert", "login"]);
	$self->logDebug("result", $result);
	return $result;

	#### UPDATE LOCATION OF KEY FILE AND PUBLIC CERT IN hub TABLE
	$success = $self->_updateHubKeys($username, $keyfile, $publiccert);
	if ( $success ) {
		$self->notifyStatus($hub, "Created hub certificate");	
	}
	else {
		$self->notifyError($hub, "Can't create certificate");	
	}	
}

method _updateHubKeyfile ($data) {
	$self->logDebug("data", $data);
	my $table = "hub";
	my $username = $data->{username};
	my $keyfile = $data->{keyfile};
	my $hubtype = $data->{hubtype};

	my $query = qq{UPDATE $table
	SET keyfile='$keyfile',
	hubtype = '$hubtype'
	WHERE username='$username'};
	$self->logDebug("$query");
	
	return $self->db()->do($query);
}

method _generateHubKeys ($username, $login, $hubtype, $keyfile) {
	$self->logDebug("keyfile", $keyfile);
	
	#### PRINT PRIVATE KEY FROM aws TABLE TO HUB KEY FILE
	$keyfile = $self->_printHubKeyFile($username, $login, $hubtype) ;
	return undef if not defined $keyfile;

	#### GENERATE RSA-FORMAT REPO PUBLIC CERT FROM HUB PRIVATE KEY
	my $certfile 	= 	"$keyfile.pub";
	$self->logDebug("certfile", $certfile);

	return $self->createHubCertificate($keyfile, $certfile);
}

method _printHubKeyFile ($username, $login, $hubtype) {
	my $aws = $self->_getAws($username);
	$self->logError("aws not defined") and return undef if not defined $aws;
	my $privatekey = 	$aws->{ec2privatekey};
	$self->logError("AWS privatekey not defined") and return undef if not defined $privatekey;

	#### CREATE REPO PRIVATE SSH KEY DIR
	my $keydir = $self->head()->ops()->getHubKeyDir($login, $hubtype);
	`mkdir -p $keydir` if not -d $keydir;
	$self->logError("Can't create keydir: $keydir") and return undef if not -d $keydir;

	#### SET FILENAMES
	my $keyfile 	=	"$keydir/id_rsa";
	$self->logDebug("keyfile: $keyfile ");
	
	#### REPO PRIVATE SSH KEY FILE
	$self->printToFile($keyfile, $privatekey);
	`chmod 600 $keyfile`;
	
	return $keyfile;
}

method setHubKeyfile ($username, $login, $hubtype) {
	#### CREATE REPO PRIVATE SSH KEY DIR
	my $keydir = $self->head()->ops()->getHubKeyDir($login, $hubtype);
	`mkdir -p $keydir` if not -d $keydir;
	$self->logCritical("Can't create keydir: $keydir") and exit if not -d $keydir;

	#### SET FILENAMES
	my $keyfile 	=	"$keydir/id_rsa";
	$self->logDebug("keyfile: $keyfile ");

	return $keyfile;
}

method createHubCertificate ($privatefile, $publicfile) {
	$self->logDebug("privatefile: $privatefile ");
	$self->logDebug("publicfile", $publicfile);
	my $remove = "rm -fr $publicfile";
	$self->logDebug("remove", $remove);
	`$remove` if -f $publicfile;
	
	my $command = "ssh-keygen -y -f $privatefile -q -P '' > $publicfile";
	$self->logDebug("command", $command);
	my $output = `$command`;
	$self->logDebug("output", $output);
	return if $output ne '' or -z $publicfile;

	my $publiccert = `cat $publicfile`;
	
	return $publiccert;
}

method _updateHubKeys ($username, $keyfile, $publiccert) {
    $self->logError("username not defined") and return 0 if not defined $username;
    $self->logError("keyfile not defined") and return 0 if not defined $keyfile;

	my $query = qq{UPDATE hub
SET keyfile='$keyfile',
publiccert='$publiccert'
WHERE username='$username'};
	$self->logDebug("query", $query);

	return $self->db()->do($query);
}



1;