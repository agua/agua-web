package Web::Cloud::Ami;
use Moose::Role;
use Method::Signatures::Simple;

=head2

	PACKAGE		Web::Cloud::Ami
	
	PURPOSE
	
		CLUSTER METHODS FOR Web
		



	SUBROUTINE		addAmi
	
	PURPOSE

		ADD A CLUSTER TO THE cluster TABLE
        
		IF THE USER HAS NO AWS CREDENTIALS INFORMATION,
		
		USE THE 'admin' USER'S AWS CREDENTIALS AND STORE
		
		THE CONFIGFILE IN THE ADMIN USER'S .starcluster
		
		DIRECTORY

=cut

method addAmi ($data) {
	$self->logDebug("data", $data);

	$self->_removeAmi($data);	
	my $success = $self->_addAmi($data);
	$self->notifyError($data, "Could not add ami $data->{aminame}") and return if not $success;
 	$self->notifyStatus($data, "Added AMI $data->{aminame}: ($data->{amiid})") if $success;
	return;
}

method _addAmi ($data) {
	$self->logDebug("data", $data);
	
	#### SET TABLE AND REQUIRED FIELDS	
	my $table = "ami";
	my $required_fields = ["username", "amiid"];

	#### CHECK REQUIRED FIELDS ARE DEFINED
	my $not_defined = $self->db()->notDefined($data, $required_fields);
    $self->logError("not defined: @$not_defined") and return if @$not_defined;

	#### DO ADD
	return $self->_addToTable($table, $data, $required_fields);	
}

method removeAmi ($data) {
#### REMOVE A CLUSTER FROM THE cluster TABLE
 	$self->logDebug("data", $data);
	
	my $success = $self->_removeAmi($data);
	return if not defined $success;
 	$self->logError("Could not remove cluster $data->{cluster}") and return if not defined $success;
 	$self->logStatus("Removed AMI $data->{aminame}: ($data->{amiid})") if $success;
	return;	
}

method _removeAmi ($data) {
 	$self->logDebug("data", $data);

	#### SET CLUSTER, TABLE AND REQUIRED FIELDS	
	my $table = "ami";
	my $required_fields = ["username", "amiid"];

	#### CHECK REQUIRED FIELDS ARE DEFINED
	my $not_defined = $self->db()->notDefined($data, $required_fields);
    $self->logError("undefined values: @$not_defined") and return if @$not_defined;

	return $self->_removeFromTable($table, $data, $required_fields);
}

method getAmis ($data) {
#### RETURN AN ARRAY OF cluster HASHES
 	$self->logDebug("data", $data);

	my $username	=	$self->username();
	#### GET ALL SOURCES
	my $adminuser = $self->conf()->getKey($self->application(), "ADMINUSER");
	my $aguauser = $self->conf()->getKey($self->application(), "AGUAUSER");
	my $query = qq{SELECT * FROM ami
WHERE username='$adminuser'
OR username='$aguauser'
OR username='$username'};
	$self->logDebug("$query");	;
	my $clusters = $self->db()->queryhasharray($query);

	#### SET TO EMPTY ARRAY IF NO RESULTS
	$clusters = [] if not defined $clusters;

	return $clusters;
}

method getAmi ($username, $cluster) {
	$self->logDebug("username", $username);
	$self->logDebug("cluster", $cluster);
	
	#### GET ALL SOURCES
	my $query = qq{SELECT * FROM cluster
WHERE username='$username'
AND cluster='$cluster'};
	$self->logDebug("$query");	;
	
	return $self->db()->queryhash($query);
}

1;